import { FC, useEffect, useState } from 'react';
import {
  useLazyGetStoreInfoQuery,
  useLazyGetUserInfoQuery,
  useLoginMutation,
} from '../features/apiSlice';
import { LockTwoTone, MailTwoTone } from '@ant-design/icons';
import { Card, Row, Col, Form, Input, Button, Spin } from 'antd';
import { Logo } from '../components/Logo';

import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated } from '../features/userSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

type FormData = {
  username: string;
  password: string;
};

export const Login: FC = () => {
  const [isFormValid, setIsFormValid] = useState(false);

  const [form] = Form.useForm<FormData>();

  const [login, { isLoading, isError, error }] = useLoginMutation();
  const [fetchStoreInfo, { isLoading: isLoadingStoreInfo }] =
    useLazyGetStoreInfoQuery();
  const [fetchUserInfo, { isLoading: isLoadingUserInfo, data: userInfoData }] =
    useLazyGetUserInfoQuery();

  const dispatch = useDispatch();

  const values = Form.useWatch([], form);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const userInfoResult = await fetchUserInfo();

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

    fetchUser();
  }, []);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsFormValid(true))
      .catch(() => setIsFormValid(false));
  }, [form, values]);

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
              <p className="mb-6 tracking-wide font-sans text-sm">
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
                    placeholder="Username"
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
                    placeholder="********"
                    prefix={<LockTwoTone twoToneColor="#999" />}
                  />
                </Form.Item>
                {isError && (
                  <p className="text-red-500 mb-4">
                    {
                      (error as FetchBaseQueryError).data?.message.split(
                        '::',
                      )[1]
                    }
                  </p>
                )}
                <Button
                  htmlType="submit"
                  className="text-lg p-5 font-bold !shadow-none bg-[#288364] hover:!bg-[#206b53] disabled:opacity-60 disabled:bg-[#288364] disabled:text-[#fff]"
                  type="primary"
                  block
                  disabled={!isFormValid}
                  loading={isLoading || isLoadingStoreInfo}
                >
                  Log in
                </Button>
              </Form>
              {/* If this takes you to another page, it must be an anchor, not a button */}
              <Button
                className="font-bold mt-2 p-5 text-lg hover:!border-[#288364] hover:!text-[#288364]"
                block
              >
                Forgot your password?
              </Button>
            </Card>
          )}
        </Col>
      </Row>
    </main>
  );
};
