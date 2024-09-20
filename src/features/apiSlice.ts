import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://stgapp-bwgkn3md.opensend.com',
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getStoreInfo: builder.query({
      query: (storeId) => {
        const tokens = JSON.parse(localStorage.getItem('OpenSend_tokens')!);

        return {
          url: `/store/${storeId}`,
          method: 'GET',
          headers: {
            'Access-Token': `Bearer ${tokens.accessToken}`,
            'Client-Token': tokens.clientToken,
          },
        };
      },
    }),
    getUserInfo: builder.query({
      query: () => {
        const tokens = JSON.parse(localStorage.getItem('OpenSend_tokens')!);

        return {
          url: '/self/profile',
          method: 'GET',
          headers: {
            'Access-Token': `Bearer ${tokens?.accessToken}`,
            'Client-Token': tokens?.clientToken,
          },
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLazyGetStoreInfoQuery,
  useLazyGetUserInfoQuery,
} = apiSlice;
