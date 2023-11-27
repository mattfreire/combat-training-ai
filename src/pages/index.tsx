import { type Metadata } from "next";
import Head from "next/head";
import { Dojo } from "~/components/dojo";

export const metadata: Metadata = {
  title: "Combat Training",
  description: "Training for combat",
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Combat Training</title>
        <meta name="description" content="Training for combat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Dojo />
    </>
  );
}
