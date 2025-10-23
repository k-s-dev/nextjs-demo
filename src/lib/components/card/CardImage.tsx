"use client";

import styles from "./Card.module.scss";
import Image, { ImageProps } from "next/image";

export function CardImage({
  alt = "",
  img = true,
  children,
  ...props
}: CardImageProps) {
  return (
    <article className={styles.imageContainer}>
      {img && <Image className={styles.image} alt={alt} {...props} />}
      {children}
    </article>
  );
}

export interface CardImageProps extends ImageProps {
  alt: string;
  img?: boolean;
  children?: React.ReactNode;
}
