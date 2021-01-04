import React from 'react';
import Layout from '../components/layout/Layout';
import Wiki from '../components/views/Wiki';

export const WikiPage = () => (
  <Layout
    title="The Chumbo | Wiki"
    description="A place for all things Chumbo that get asked, answered, and then usually forgotten."
  >
    <Wiki/>
  </Layout>
);

export default WikiPage;
