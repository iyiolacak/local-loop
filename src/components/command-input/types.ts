export interface CommandFormProps {
  /** Callback fired when the user sends text */
  onSubmit: (value: string) => void;
  /** Placeholder for the textarea  */
  placeholder?: string;
  containerRef?: React.RefObject<HTMLDivElement>;
}