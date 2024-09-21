import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Card, Row, Col, Form, Input, Button, Spin } from 'antd';
import { LockTwoTone, MailTwoTone } from '@ant-design/icons';
import {
  useLazyGetStoreInfoQuery,
  useLazyGetUserInfoQuery,
  useLoginMutation,
} from '@/redux/slices/apiSlice';
import { setIsAuthenticated } from '@/redux/slices/userSlice';
import { Logo } from '@/components/Logo';

import './Login.css';

type FormData = {
  username: string;
  password: string;
};

export const Login: FC = () => {
  const [isFormValid, setIsFormValid] = useState(false);

  const [login, { isLoading, isError, error }] = useLoginMutation();
  const [fetchStoreInfo, { isLoading: isLoadingStoreInfo }] =
    useLazyGetStoreInfoQuery();
  const [fetchUserInfo, { isLoading: isLoadingUserInfo, data: userInfoData }] =
    useLazyGetUserInfoQuery();

  const [form] = Form.useForm<FormData>();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const values = Form.useWatch([], form);

  useEffect(() => {
    const tokens = JSON.parse(localStorage.getItem('OpenSend_tokens')!);

    if (tokens?.accessToken) {
      fetchUser();
    }
  }, []);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsFormValid(true))
      .catch(() => setIsFormValid(false));
  }, [form, values]);

  // fetching logic

  async function fetchUser() {
    try {
      const userInfoResult = await fetchUserInfo({});

      const userType = userInfoResult?.data?.view?.type;
      const storeId = userInfoResult?.data?.view?.accesses[0]?.store_id;

      if (userType) {
        dispatch(setIsAuthenticated(true));
        handleRedirection(userType, storeId);
      }
    } catch (err) {
      dispatch(setIsAuthenticated(false));
      console.error(err);
    }
  }

  const handleLogin = async () => {
    const { username, password } = values;

    try {
      const result = await login({ email: username, password }).unwrap();

      dispatch(setIsAuthenticated(true));

      const tokensInfo = {
        accessToken: result.tokens.accessToken,
        clientToken: result.tokens.clientToken,
      };

      localStorage.setItem('OpenSend_tokens', JSON.stringify(tokensInfo));

      const userType = result?.view?.type;
      const storeId = result?.view?.accesses[0]?.store_id;

      handleRedirection(userType, storeId);
    } catch (err) {
      dispatch(setIsAuthenticated(false));
      console.error(err);
    }
  };

  const handleRedirection = async (
    userType: 'ADMIN' | 'CLIENT',
    storeId: number,
  ) => {
    try {
      if (userType === 'ADMIN') {
        navigate('/admin');
      } else if (userType === 'CLIENT') {
        const storeInfoResult = await fetchStoreInfo(storeId);
        const onboardingStatus =
          storeInfoResult?.data?.store?.onboarding_procedure?.onboarding_status;

        if (onboardingStatus !== 'DONE') {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      dispatch(setIsAuthenticated(false));
      console.error(err);
    }
  };

  // handlers

  const handleFormSubmit = () => {
    handleLogin();
  };

  return (
    <main className="login flex flex-col justify-center items-center">
      <div className="mb-6">
        <Logo />
      </div>
      <Row className="w-full flex justify-center">
        <Col
          xs={{ flex: '100%' }}
          sm={{ flex: '80%' }}
          md={{ flex: '50%' }}
          lg={{ flex: '45%' }}
          xl={{ flex: '40%' }}
        >
          {isLoadingUserInfo || (isLoadingStoreInfo && userInfoData) ? (
            <Spin />
          ) : (
            <Card className="p-4">
              <h1 className="font-semibold text-3xl mb-2 leading-normal">
                Welcome back!
              </h1>
              <p className="mb-6  font-sans text-sm">
                Log in to continue with Opensend
              </p>
              <Form form={form} name="login" onSubmitCapture={handleFormSubmit}>
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: 'Please type your username' },
                    {
                      pattern:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Please type a valid email address',
                    },
                  ]}
                >
                  <Input
                    type="email"
                    placeholder="Email"
                    prefix={<MailTwoTone twoToneColor="#999" />}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Please type your password' },
                  ]}
                >
                  <Input.Password
                    placeholder="Password"
                    prefix={<LockTwoTone twoToneColor="#999" />}
                  />
                </Form.Item>
                {/* I placed the error here to give a visual differentiation between errors caused by the user directly and errors that come from the backend */}
                {isError && (
                  <p
                    className="text-red-500 mb-4 font-sans"
                    data-testid="login-error-message"
                  >
                    {
                      (
                        (error as FetchBaseQueryError).data as {
                          message: string;
                        }
                      )?.message.split(':: ')[1]
                    }
                  </p>
                )}
                <Button
                  htmlType="submit"
                  className="rounded text-lg p-5 font-bold !shadow-none bg-[#288364] hover:!bg-[#206b53] disabled:opacity-60 disabled:bg-[#288364] disabled:text-[#fff]"
                  type="primary"
                  block
                  disabled={!isFormValid}
                  loading={isLoading || isLoadingStoreInfo}
                  data-testid="login-btn"
                >
                  {/* Change to Log in (the verb) */}
                  Login
                </Button>
              </Form>
              {/* If this takes you to another page, it must be an anchor, not a button */}
              <Button
                className="rounded font-bold mt-2 p-5 text-lg hover:!border-[#288364] hover:!text-[#288364]"
                block
              >
                Forgot Your Password?
              </Button>
            </Card>
          )}
        </Col>
      </Row>
    </main>
  );
};
