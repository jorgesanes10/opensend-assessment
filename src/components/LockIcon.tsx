import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export const LockIcon: FC = () => {
  const [fill, setFill] = useState('#1c1c1c');
  const theme = useSelector((state: RootState) => state.theme.theme);

  useEffect(() => {
    setFill(theme === 'light' ? '#1c1c1c' : '#a8a8a8');
  }, [theme]);

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path
        d="M10.5594 6H5.4413C5.08988 5.99999 4.78668 5.99998 4.53698 6.02038C4.27341 6.04192 4.01127 6.08946 3.75901 6.21799C3.38269 6.40974 3.07673 6.7157 2.88498 7.09202C2.75645 7.34427 2.70891 7.60642 2.68737 7.86998C2.66697 8.11969 2.66698 8.42286 2.66699 8.77428V11.8924C2.66698 12.2438 2.66697 12.547 2.68737 12.7967C2.70891 13.0603 2.75645 13.3224 2.88498 13.5746C3.07673 13.951 3.38269 14.2569 3.75901 14.4487C4.01127 14.5772 4.27341 14.6248 4.53698 14.6463C4.78669 14.6667 5.08986 14.6667 5.44129 14.6667H10.5593C10.9108 14.6667 11.214 14.6667 11.4637 14.6463C11.7272 14.6248 11.9894 14.5772 12.2416 14.4487C12.618 14.2569 12.9239 13.951 13.1157 13.5746C13.2442 13.3224 13.2917 13.0603 13.3133 12.7967C13.3337 12.547 13.3337 12.2438 13.3337 11.8924V8.77432C13.3337 8.42292 13.3337 8.11968 13.3133 7.86998C13.2917 7.60642 13.2442 7.34427 13.1157 7.09202C12.9239 6.7157 12.618 6.40974 12.2416 6.21799C11.9894 6.08946 11.7272 6.04192 11.4637 6.02038C11.214 5.99998 10.9108 5.99999 10.5594 6Z"
        fill="#C8C9C8"
      ></path>
      <path
        d="M7.33301 10.6667C7.33301 10.2985 7.63148 10 7.99967 10C8.36786 10 8.66634 10.2985 8.66634 10.6667V11.3333C8.66634 11.7015 8.36786 12 7.99967 12C7.63148 12 7.33301 11.7015 7.33301 11.3333V10.6667Z"
        fill={'#1C1C1C'}
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.33301 4.00001C5.33301 2.52725 6.52692 1.33334 7.99967 1.33334C9.47243 1.33334 10.6663 2.52725 10.6663 4.00001V6.00001H9.33301V4.00001C9.33301 3.26363 8.73605 2.66668 7.99967 2.66668C7.26329 2.66668 6.66634 3.26363 6.66634 4.00001V6.00001H5.33301V4.00001Z"
        fill={fill}
      ></path>
    </svg>
  );
};
