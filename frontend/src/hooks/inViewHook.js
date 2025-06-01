import React, {useRef, useState, useEffect} from "react"

const useInView = (options = {}) => {
    const ref = useRef();
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      }, options);
  
      if (ref.current) observer.observe(ref.current);
  
      return () => observer.disconnect();
    }, [ref, options]);
  
    return [ref, isVisible];
  };

export default useInView