
import { useEffect, useState, RefObject } from "react";

export function useSearchHeaderScroll(
  searchHeaderRef: RefObject<HTMLDivElement>
) {
  const [searchHeaderSticky, setSearchHeaderSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (searchHeaderRef.current) {
        const rect = searchHeaderRef.current.getBoundingClientRect();
        setSearchHeaderSticky(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [searchHeaderRef]);

  return searchHeaderSticky;
}
