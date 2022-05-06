import Head from 'next/head';
import Layout from '../../src/components/Layout';
import Product from '../../src/models/Product';
import dbConnect from '../../utils/dbConnect';

export default function Products({ products }) {
  return (
    <Layout>
      <Head>
        <title>Arion</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2>Products</h2>
      <div>
        {products.map((product) => (
          <div key={product._id}>{product.name}</div>
        ))}
      </div>
    </Layout>
  );
}
export async function getServerSideProps() {
  await dbConnect.connect();
  const products = await Product.find({}).lean();
  await dbConnect.disconnect();

  return {
    props: {
      products: products.map(dbConnect.convertDocToObj),
    },
  };
}
