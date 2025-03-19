import css from "./ProgressBar.module.scss";

const ProgressBar = ({ progress: { percent }, color, label }) => {
  return (
    <div className={css.progress}>
      <div className={css.total}>
        <div className={css.current} style={{ width: `${percent}%`, background: color }} />
        {label && <div className={css.label}>{label}</div>}
      </div>
    </div>
  );
};

export default ProgressBar;
