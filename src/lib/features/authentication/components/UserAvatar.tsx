"use client";

import { Avatar } from "@mantine/core";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function UserAvatar({
  src,
  userName,
  width = 50,
  height = 50,
  altText = "User Avatar",
}: {
  src?: string;
  userName?: string;
  width?: number;
  height?: number;
  altText?: string;
}) {
  const [imageExists, setImageExists] = useState<boolean>(false);

  useEffect(() => {
    if (src) {
      fetch(src, { method: "HEAD" }).then((response) => {
        if (response.status.toString().startsWith("2")) {
          setImageExists(true);
        }
      });
    }
  }, [src]);

  if (src && imageExists) {
    return (
      <Avatar>
        <Image src={src} alt={altText} width={width} height={height} />
      </Avatar>
    );
  }

  if (userName) {
    return <Avatar name={userName} color="initials" alt={altText} />;
  }

  return <Avatar alt={altText} />;
}
