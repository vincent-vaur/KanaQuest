import bcrypt from "bcrypt";
import passport from "passport";
import LocalStrategy from "passport-local";
import * as GoogleStrategy from "passport-google-oauth20";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

/**
 * Generate a hash from the given password
 */
export const hashPassword = async (password, saltRounds = 10) => {
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Returns if the given password corresponds to the given hash
 */
export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Authentication middleware.
 * Passe les données de l'utilisateur aux templates.
 * Si l'utilisateur n'est pas authentifié, redirige vers login
 */
export const authMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.isAuthenticated = true;
    res.locals.user = req.user;
    return next();
  }

  res.redirect("/login");
};

/**
 * Créé un utilisateur
 */
export const createAuth = async (user, password, db) =>
  await db.authentication.create({
    data: {
      password: await hashPassword(password),
      user: {
        connectOrCreate: {
          where: {
            email: user.email
          },
          create: user
        }
      }
    },
    include: {
      user: true
    }
  });

/**
 * Persist the user in session
 */
const serializeUser = (user, cb) => {
  process.nextTick(() => {
    cb(null, user);
  });
};

/**
 * Read user from session
 */
const deserializeUser = (user, cb) => {
  process.nextTick(() => {
    return cb(null, user);
  });
};

/**
 * Authenticate the user against the db
 */
const authenticateUser = db => async (email, password, cb) => {
  try {
    const user = await db.User.findFirst({
      where: { email },
      include: {
        authentication: true
      }
    });

    // Check if user exists and if true check the given password
    if (!user || !(await verifyPassword(password, user.authentication.password))) {
      return cb(null, false, {
        message: "Incorrect username or password."
      });
    }

    // Remove authentication details from user for security
    const { authentication, ...sanitizedUser } = user;

    cb(null, sanitizedUser);
  } catch (e) {
    return cb(e);
  }
};

/**
 * Initialize authentication behaviors
 */
export const initAuthentication = (app, db) => {
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser(db)));

  passport.use(
    new GoogleStrategy.Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.NODE_ENV === "production" ? process.env.GOOGLE_CALLBACK_URL : process.env.GOOGLE_CALLBACK_URL_DEV
      },
      function(accessToken, refreshToken, profile, cb) {
        const profileData = profile._json;

        db.user
          .create({
            data: {
              email: profileData.email,
              username: profileData.given_name,
              picture: profileData.picture
            }
          })
          .then(user => {
            return cb(null, user);
          });
      }
    )
  );

  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);

  // Sessions
  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? "my_compicated_session_secret",
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 1h
      },
      store: new PrismaSessionStore(db, {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined
      })
    })
  );

  app.use(passport.initialize());
  app.use(passport.authenticate("session"));
};
