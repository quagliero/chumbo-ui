/* eslint-disable no-unused-vars */
import React from 'react';
import Layout from '../components/layout/Layout';
import Home from '../components/views/Home';

export const IndexPage = () => (
  <Layout
    title="The Chumbo | Home"
    description="World's greatest fantasy football league."
  >
    <Home/>
  </Layout>
);

export default IndexPage;
