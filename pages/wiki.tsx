/* eslint-disable no-unused-vars */
import React from 'react';
import Layout from '../components/layout/Layout';
import Wiki from '../components/views/Wiki';

export const WikiPage = () => (
  <Layout
    title="The Chumbo"
    description="World's greatest fantasy football league."
  >
    <Wiki/>
  </Layout>
);

export default WikiPage;
