
import './Footer.css';

const Footer: React.FC = () => {

  return (
    <footer className="footer">
        <div className="footer-container">
            <div className="footer-logo">
            <span className="poke">Poke</span><span className="mmo">MMO</span><span className="tools"> Tools</span>
            </div>
            <ul className="footer-menu">
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Privacy Policy</a></li>
            </ul>
            <div className="footer-socials">
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-discord"></i></a>
            <a href="#"><i className="fab fa-github"></i></a>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; 2025 PokeMMO Tools. All Rights Reserved.</p>
        </div>
        </footer>
  );
};

export default Footer;
