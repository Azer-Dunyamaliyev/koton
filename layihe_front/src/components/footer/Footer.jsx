import React from "react";
import styles from "./footer.module.scss";
import { Link, useNavigate } from "react-router-dom";
import store from "../../assets/images/app_store.png";
import play from "../../assets/images/google_play.png";
import tiktok from "../../assets/images/tiktok.png";
import instagram from "../../assets/images/instagram.png";
import facebook from "../../assets/images/facebook.png";
import twitter from "../../assets/images/twitterv2.png";
import youtube from "../../assets/images/youtube.png";
import spotify from "../../assets/images/spotify.png";
import pinterest from "../../assets/images/pinterest.png";
const Footer = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const handlePurchasesClick = (e) => {
    if (!token) {
      e.preventDefault(); 
      navigate("/register");
    }
  };
  return (
    <div className={styles.footer}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.texts}>
            <div className={styles.text}>
              <h3>Help</h3>
              <ul>
                <li>
                  <Link
                    to={token ? "/purchases" : '/register'}
                    onClick={handlePurchasesClick}
                  >
                    My order status
                  </Link>
                </li>
              </ul>
            </div>
            <div className={styles.text}>
              <h3>Company</h3>
              <ul>
                <li>
                  <Link to={"/about"}>About Us</Link>
                </li>
                <li>
                  <Link to={"/about"}>Work with us</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.social}>
            <div className={styles.app}>
              <h3>Our app</h3>
              <div className={styles.images}>
                <Link
                  to={
                    "https://apps.apple.com/tr/app/koton-giyim-al%C4%B1%C5%9Fveri%C5%9F-sitesi/id1436987707"
                  }
                >
                  <img src={store} alt="app store" />
                </Link>
                <Link
                  to={
                    "https://play.google.com/store/apps/details?id=com.koton.app&hl=tr"
                  }
                >
                  <img src={play} alt="google play" />
                </Link>
              </div>
            </div>
            <div className={styles.platform}>
              <h3>Follow us!</h3>
              <div className={styles.icons}>
                <Link to={"https://www.tiktok.com/@kotoncom"}>
                  <img src={tiktok} alt="tiktok" />
                </Link>
                <Link to={"https://www.instagram.com/koton/"}>
                  <img src={instagram} alt="instagram" />
                </Link>
                <Link to={"https://www.facebook.com/KotonGlobal/?locale=tr_TR"}>
                  <img src={facebook} alt="facebook" />
                </Link>
                <Link to={"https://x.com/koton?mx=2"}>
                  <img src={twitter} alt="twitter" />
                </Link>
                <Link
                  to={
                    "https://www.youtube.com/channel/UCGxrvLicvePAxeSigIVH0IQ"
                  }
                >
                  <img src={youtube} alt="youtube" />
                </Link>
                <Link
                  to={"https://open.spotify.com/artist/3ywPVNDDrvBtO00ghXXIaS"}
                >
                  <img src={spotify} alt="spotify" />
                </Link>
                <Link to={"https://tr.pinterest.com/koton/"}>
                  <img src={pinterest} alt="pinterest" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
