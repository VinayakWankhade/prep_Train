import { useEffect, useRef } from 'react';

interface UseClickOutsideProps {
  onClickOutside: () => void;
  active: boolean;
  ignoreClass?: string;
}

const useClickOutside = ({ onClickOutside, active, ignoreClass = '' }: UseClickOutsideProps) => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !(ignoreClass && (event.target as HTMLElement).classList.contains(ignoreClass))
      ) {
        onClickOutside();
      }
    };

    if (active) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      if (active) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [onClickOutside, active, ignoreClass]);

  return ref;
};

export default useClickOutside;

