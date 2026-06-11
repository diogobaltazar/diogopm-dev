declare module '*.mdx' {
  import type { MDXProps } from 'mdx/types'
  export const frontmatter: {
    title: string
    date: string
    description: string
  }
  export default function MDXContent(props: MDXProps): JSX.Element
}
