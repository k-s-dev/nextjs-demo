export interface INavLinks {
  [k: string]: {
    title: string;
    href?: string;
    links?: INavLinks;
  };
}

export interface INavLink {
  title: string;
  href: string;
  links?: INavLink[];
}

export interface INavLinkClassNames {
  base: string;
  active: string;
}
