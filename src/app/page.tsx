"use server";

import styles from "./page.module.scss";
import { Button } from "@mantine/core";
import Link from "next/link";

export default async function Page() {
  return (
    <main className={styles.rootContainer}>
      <header className={styles.rootHeader}>
        <h1>Nextjs App Template</h1>
      </header>

      <section className={styles.stackAndFeaturesContainer}>
        <h2>Features</h2>
        <section className={styles.featuresRow}>
          {features.map(([title, href], idx) => {
            return <Item key={idx} href={href} title={title} />;
          })}
        </section>

        <h2>Stack</h2>
        <section className={styles.stackRow}>
          {stack.map(([title, href], idx) => {
            return <Item key={idx} href={href} title={title} />;
          })}
        </section>
      </section>
    </main>
  );
}

function Item({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      target={href.length === 0 ? "_self" : "_blank"}
      referrerPolicy="no-referrer"
    >
      <Button
        fullWidth
        fz="md"
        color="yellow.1"
      >
        {title}
      </Button>
    </Link>
  );
}
const features = [
  ["Admin", ""],
  ["Authentication", ""],
  ["Authorization", ""],
  ["OAuth", ""],
  ["Sessions", ""],
  ["Data access & control layer", ""],
  ["Form validation: client & server", ""],
  ["Uploads", ""],
  ["Emails", ""],
  ["Test: e2e", ""],
  ["Test: unit", ""],
  ["Test: component", ""],
];

const stack = [
  ["Vercel", "https://www.vercel.com/"],
  ["Nextjs", "https://www.nextjs.org/"],
  ["Vercel Blob", "https://vercel.com/storage/blob"],
  ["Prisma", "https://www.prisma.io/"],
  ["Postgres", "https://www.postgresql.org"],
  ["Better-Auth", "https://www.better-auth.com/"],
  ["Valibot", "https://valibot.dev/"],
  ["Mantine UI", "https://mantine.dev/"],
  ["Cypress", "https://www.cypress.io/"],
  ["Jest", "https://jestjs.io/"],
];
