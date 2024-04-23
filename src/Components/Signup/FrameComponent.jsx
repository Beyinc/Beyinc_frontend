import styles from "./FrameComponent.module.css";

const FrameComponent = () => {
  return (
    <div className={styles.rectangleParent}>
      <div className={styles.frameChild} />
      <img
        className={styles.graphicElementIcon}
        loading="lazy"
        alt=""
        src="/rectangle-16@2x.png"
      />
      <div className={styles.mainContent}>
        <h1 className={styles.welcomeToSocialEntrepreneurContainer}>
          <p className={styles.welcomeToSocial}>Welcome to Social</p>
          <p className={styles.entrepreneurshipPlatform}>
            Entrepreneurship Platform
          </p>
        </h1>
      </div>
      <h1 className={styles.increasingTheSuccess}>
        Increasing the success rate of startup
      </h1>
    </div>
  );
};

export default FrameComponent;
