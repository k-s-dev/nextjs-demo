"use client";

import styles from "./Features.module.scss";
import {
  Anchor,
  CardSection,
  CardSectionProps,
  List,
  ListItem,
  Pill,
  PillGroup,
  Title,
} from "@mantine/core";
import BasicCard, { TBasicCardProps } from "@/lib/ui/card/BasicCard";
import Link from "next/link";
import { routes } from "@/lib/utils/routeMapper";

export default function Features() {
  return (
    <>
      <section className={styles.cards}>
        <OrgFeatureTaskCard />
        <OrgFeatureTimerCard />
        <OrgFeatureCounterCard />
        <OrgFeatureMoreCard />
        {/* <OrgFeatureCalendarCard /> */}
      </section>
    </>
  );
}

export function OrgFeatureCard({ children, ...rest }: TBasicCardProps) {
  return (
    <BasicCard m={0} w="100%" {...rest}>
      {children}
    </BasicCard>
  );
}

export function OrgFeatureCardHeader({
  children,
  ...rest
}: { children: React.ReactNode } & CardSectionProps) {
  return (
    <CardSection withBorder mb="xs" p="xs" w="100%" {...rest}>
      {children}
    </CardSection>
  );
}

export function OrgFeatureTaskCard() {
  return (
    <OrgFeatureCard>
      <OrgFeatureCardHeader>
        <FeatureHeaderL1 href={routes.org.tasks.root}>Tasks</FeatureHeaderL1>
        <FeatureHeaderL2>
          <PillGroup>
            <Pill size="lg">Organize</Pill>
            <Pill size="lg">Track</Pill>
            <Pill size="lg">Search</Pill>
            <Pill size="lg">Filter</Pill>
            <Pill size="lg">Sort</Pill>
          </PillGroup>
        </FeatureHeaderL2>
      </OrgFeatureCardHeader>
      <List fz="xl">
        <ListItem>
          Workspaces, Categories, Tags, Status, Priority, Dates
        </ListItem>
        <ListItem>Rich text notes for each task</ListItem>
      </List>
    </OrgFeatureCard>
  );
}

export function OrgFeatureCalendarCard() {
  return (
    <OrgFeatureCard>
      <OrgFeatureCardHeader>
        <FeatureHeaderL1>Calendar</FeatureHeaderL1>
        <FeatureHeaderL2>Track recurring tasks</FeatureHeaderL2>
      </OrgFeatureCardHeader>
      <List fz="xl">
        <ListItem>e.g. maid, dairy, service, payments, ...</ListItem>
      </List>
    </OrgFeatureCard>
  );
}

export function OrgFeatureTimerCard() {
  return (
    <OrgFeatureCard>
      <OrgFeatureCardHeader>
        <FeatureHeaderL1 href={routes.org.timer.root}>Timer</FeatureHeaderL1>
      </OrgFeatureCardHeader>
    </OrgFeatureCard>
  );
}

export function OrgFeatureCounterCard() {
  return (
    <OrgFeatureCard>
      <OrgFeatureCardHeader>
        <FeatureHeaderL1 href={routes.org.counter.root}>
          Counter
        </FeatureHeaderL1>
      </OrgFeatureCardHeader>
    </OrgFeatureCard>
  );
}

export function OrgFeatureMoreCard() {
  return (
    <OrgFeatureCard>
      <OrgFeatureCardHeader>
        <FeatureHeaderL1>More to be added ...</FeatureHeaderL1>
      </OrgFeatureCardHeader>
    </OrgFeatureCard>
  );
}

function FeatureHeaderL1({
  href,
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <Title order={3} fz={"h1"}>
      <Anchor
        component={Link}
        href={href || "#"}
        fz={"h1"}
        c="green.7"
        underline="not-hover"
      >
        {children}
      </Anchor>
    </Title>
  );
}

function FeatureHeaderL2({ children }: { children: React.ReactNode }) {
  return (
    <Title order={4} fz={"h3"}>
      {children}
    </Title>
  );
}
