import { MobileSidebar } from "@/components/mobile-sidebar";


const Navbar = async () => {


  return ( 
    <div className="flex items-center p-4">
      <MobileSidebar/>
      <div className="flex w-full justify-end">
        
      <img
          alt=""
          src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          className="inline-block size-2 rounded-full ring-2 ring-white"
        />
      </div>
    </div>
   );
}
 
export default Navbar;