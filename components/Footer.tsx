import { FaFacebook, FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-6 mt-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-4">
        {/* Espace gauche */}
        <div className="hidden md:block flex-1" />
        {/* Icônes centrées */}
        <div className="flex gap-4 justify-center flex-1">
          <a href="https://www.facebook.com/profile.php?id=61576390177833" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebook className="w-6 h-6 hover:text-blue-500" />
          </a>
          <a href="https://wa.me/242053340606" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <FaWhatsapp className="w-6 h-6 hover:text-green-400" />
          </a>
          <a href="https://instagram.com/tonrestaurant" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram className="w-6 h-6 hover:text-pink-400" />
          </a>
          <a href="https://tiktok.com/@tonrestaurant" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <FaTiktok className="w-6 h-6 hover:text-gray-400" />
          </a>
          <a href="mailto:thedreamrestau@gmail.com" aria-label="Email">
            <MdEmail className="w-6 h-6 hover:text-red-400" />
          </a>
        </div>
        {/* Connexion à droite */}
        <div className="flex-1 flex justify-end w-full md:w-auto">
          <a
            href="/connexion"
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition mt-2 md:mt-0"
          >
            Connexion
          </a>
        </div>
      </div>
    </footer>
  );
} 