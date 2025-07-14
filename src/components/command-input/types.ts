export interface CommandFormProps {
  waveSurferRef: React.RefObject<HTMLDivElement>;
  /** Callback fired when the user sends text */
  onSubmit: (value: string) => void;
  /** Placeholder for the textarea  */
  placeholder?: string;
}