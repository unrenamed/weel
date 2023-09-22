import styles from "./loading-spinner.module.css";

export default function LoadingSpinner() {
  return (
    <div className="w-10">
      <div className={styles.spinner} />
    </div>
  );
}
