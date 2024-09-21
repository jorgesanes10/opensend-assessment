import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';
import { setIsAuthenticated } from '@/redux/slices/userSlice';

export const LogoutButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Button
      className="mr-2 font-semibold"
      onClick={() => {
        dispatch(setIsAuthenticated(false));
        localStorage.removeItem('OpenSend_tokens');
        navigate('/');
      }}
    >
      Log out
    </Button>
  );
};
