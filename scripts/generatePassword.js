import { hashPassword } from "../src/services/auth.js";

const main = async () => {
  if (process.argv.length < 3) {
    console.error(
      "You must provide a password : npm run password:generate my_password"
    );
    process.exit(1);
  }

  const hash = await hashPassword(process.argv[2]);

  console.log(`Hash for password ${process.argv[2]} : ${hash}`);
};

main();
