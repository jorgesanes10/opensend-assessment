import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';
import { setIsAuthenticated } from '@/redux/slices/userSlice';

export const LogoutButton: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Button
      className="mr-2 text-lg font-semibold hover:!border-[#288364] hover:!text-[#288364]"
      onClick={() => {
        dispatch(setIsAuthenticated(false));
        localStorage.removeItem('OpenSend_tokens');
        navigate('/');
      }}
      data-testid="logout-btn"
    >
      Log out
    </Button>
  );
};
