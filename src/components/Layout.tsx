import { FC, ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { RootState } from '@/redux/store';
import { toggleTheme } from '@/redux/slices/themeSlice';

type LayoutProps = {
  children: ReactNode;
};

export const Layout: FC<LayoutProps> = ({ children }) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.className = theme;
    console.log('theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <>
      <div className="w-full flex justify-end">
        <Button
          onClick={handleToggleTheme}
          shape="circle"
          icon={theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
          data-testid="theme-toggle-btn"
        />
      </div>
      {children}
    </>
  );
};
