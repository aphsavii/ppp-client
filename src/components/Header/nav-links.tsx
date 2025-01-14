import { Button } from "@/shadcn/ui/button"
import { cn } from "@/lib/utils"
import { Home, File, Pen } from "lucide-react"
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { rootState } from "@/redux/store";
import { AuthState } from "@/types/User";

const links = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Question",
    href: "/admin/questions",
    icon: File,
    admin: true
  },
  {
    title: "Aptitudes",
    href: "/admin/aptitudes",
    icon: Pen,
    admin: true
  },
  {
    title: "Aptitudes",
    href: "/aptitudes",
    icon: Pen,
    admin: false
  },
]

export function NavLinks() {
  const auth: AuthState = useSelector((state: rootState) => state.auth);
  return (
    <>
      {links.map((link) => (
        (link.admin && auth?.isAdmin) ? (
          <Link to={link.href} key={link.title} className={cn("nav-link")}>
            <Button variant="ghost" className="w-full justify-start">
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
            </Button>
          </Link>
        ) : (
          !link.admin && auth.isAuthenticated && !auth?.isAdmin  && (
            <Link to={link.href} key={link.title} className={cn("nav-link")}>
              <Button variant="ghost" className="w-full justify-start">
                <link.icon className="mr-2 h-4 w-4" />
                {link.title}
              </Button>
            </Link>
          )
        )
      ))}
    </>
  )
}