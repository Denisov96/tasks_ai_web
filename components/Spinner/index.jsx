export default function Spinner() {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" />

      <style jsx>{`
        .spinner-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(0, 0, 0, 0.1);
          border-top: 3px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s ease-in-out infinite;
        }

        .spinner-text {
          margin-top: 1rem;
          font-size: 0.95rem;
          color: #666;
          font-weight: 500;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
