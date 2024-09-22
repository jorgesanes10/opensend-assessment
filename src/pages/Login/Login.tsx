import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Card, Row, Col, Form, Input, Button, Spin } from 'antd';
import {
  useLazyGetStoreInfoQuery,
  useLazyGetUserInfoQuery,
  useLoginMutation,
} from '@/redux/slices/apiSlice';
import { setIsAuthenticated } from '@/redux/slices/userSlice';
import { Logo } from '@/components/Logo';
import emailIcon from '@/assets/email-icon.svg';
import lockIcon from '@/assets/lock-icon.svg';

import './Login.css';
import { LockIcon } from '@/components/LockIcon';

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
    <main className="login flex flex-col justify-center items-center gap-6">
      <div>
        <Logo />
      </div>
      <Row className="w-full flex justify-center">
        <Col>
          {isLoadingUserInfo || (isLoadingStoreInfo && userInfoData) ? (
            <Spin />
          ) : (
            <Card className="p-6">
              <div className="flex flex-col items-center gap-4">
                <h1 className="font-semibold text-[28px] leading-normal">
                  Welcome back!
                </h1>
                <p className="font-sans text-sm leading-tight">
                  Log in to continue with Opensend
                </p>
              </div>
              <Form
                className="mt-8 flex flex-col gap-4"
                form={form}
                name="login"
                onSubmitCapture={handleFormSubmit}
              >
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: 'Please type your username.' },
                    {
                      pattern:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Please type a valid email address.',
                    },
                  ]}
                >
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="my-[2px]"
                    prefix={<img className="h-4 w-4" src={emailIcon} alt="" />}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Please type your password.' },
                  ]}
                >
                  <Input.Password
                    placeholder="Password"
                    className="my-[2px]"
                    prefix={<LockIcon />}
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
                  className="rounded border-none leading-none text-lg px-6 pt-2.5 h-10 pb-3 font-semibold !shadow-none bg-[#298566] hover:!bg-[#025a3a] disabled:opacity-60 disabled:bg-[#288364] disabled:text-[#fff] transition-colors"
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
                className="!shadow-none rounded leading-none font-semibold mt-2 px-6 pt-2.5 h-10 pb-3 text-lg text-[#1d1d1b] border-[#c9cac9] hover:!border-[#585a58] hover:!text-[#1d1d1b]"
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
