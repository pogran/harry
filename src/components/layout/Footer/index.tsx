import Link from 'next/link'

export default function Footer(props: {
  links: [{ title: string; href: string; target?: string; rel?: string }]
}) {
  return (
    <footer className="border-t border-gray-200 dark:border-black-500 bg-gray-50 dark:bg-black-700">
      <div className="max-w-7xl px-4 md:px-0 mx-auto py-4 md:py-6 md:flex justify-between items-center">
        <div>
          {/* {props.links.map((link, key) => (
            <Link
              key={key}
              target={link.target}
              className="hover:text-primary-main font-medium text-base md:text-sm"
              rel={link.rel}
              href={link.href}
            >
              {link.title}
            </Link>
          ))} */}
        </div>
        <div className="text-gray-500 dark:text-gray-250 mt-4 md:mt-0 font-light md:font-medium text-xs md:text-tiny">
          {process.env.NEXT_PUBLIC_ENV_SITE_NAME} © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  )
}
