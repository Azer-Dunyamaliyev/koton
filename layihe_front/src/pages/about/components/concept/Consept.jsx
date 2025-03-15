import React from "react";
import styles from "./consept.module.scss";
const Consept = () => {
  return (
    <div className={styles.consept}>
      <div className={styles.content}>
        <div className={styles.texts}>
          <h3>Concept</h3>
          <h1>AN EVER YOUNG COMMUNITY</h1>
          <p>
            Koton started up in 1991 with a clear international mission and with
            the intention of dressing young people who are engaged with their
            environment, who live in the community and relate to each other.
            Young people who have a casual dress sense, who shun stereotypes and
            who want to feel good in whatever they are wearing. To meet their
            needs, Pull&Bear takes the latest international trends, mixing them
            with the influences that are seen on the street and in the most
            fashionable clubs, and reworks them according to their style thus
            turning them into comfortable and easy to wear garments.
          </p>
          <p>
            Koton evolves at the same pace as its customer, always watching out
            for new technologies, social movements and the latest artistic or
            musical trends. All of this can be seen reflected not only in its
            designs but also in stores. Inspired by the legendary Californian
            city of Palm Springs, the product lines are constantly being
            updated. All stores worldwide receive new merchandise twice a week.
          </p>
          <p>
            As part of the Inditex Group (Zara, Koton, Massimo Dutti,
            Bershka, Stradivarius, Oysho and Zara Home), Koton is present in
            76 markets, with a network of over 970 physical stores, as well as
            an online store.
          </p>
        </div>
        <div className={styles.image}></div>
      </div>
    </div>
  );
};

export default Consept;
