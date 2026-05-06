interface Props { message: string }

export default function ErrorMessage({ message }: Props) {
  return (
    <div id="error-message" className="error-message" data-edit-id="error-message">
      <span data-edit-id="error-message-text">⚠️ {message}</span>
    </div>
  );
}