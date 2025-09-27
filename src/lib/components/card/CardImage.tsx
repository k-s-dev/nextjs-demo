"use client";

import "./Card.scss"

import Image, { ImageProps } from "next/image";

export function CardImage({
  alt = "",
  img = true,
  children,
  ...props
}: CardImageProps) {
  return (
    <article className="card-image-container">
      {img && <Image className="card-image" alt={alt} {...props} />}
      {children}
    </article>
  );
}

export interface CardImageProps extends ImageProps {
  alt: string;
  img?: boolean;
  children?: React.ReactNode;
}
