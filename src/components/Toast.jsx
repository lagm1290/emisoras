import { useRadio } from '../context/RadioContext';

export default function Toast() {
  const { toastMessage } = useRadio();

  return (
    <div className={`toast ${toastMessage ? 'show' : ''}`} id="toast">
      {toastMessage}
    </div>
  );
}
