import { APP_NAME } from "@/lib/constraints";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return ( 
        <div className="p flex-center border-t">
         {currentYear} {APP_NAME}. All Right Reserved
        </div>
     );
}
 
export default Footer;