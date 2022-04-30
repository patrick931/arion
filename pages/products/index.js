import Product from '../../models/Product';
import dbConnect from '../../utils/dbConnect';

export default function Products({ products }) {
  return (
    <>
      <h2>Products</h2>
      <div>
        {products.map((product) => (
          <div key={product.name}>{product.name}</div>
        ))}
      </div>
    </>
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
