import { Helmet } from "react-helmet-async";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Bienvenue au site du commerce electronique Proshop",
  description: "Nous vendons des produits de qualité pour pas cher",
  keywords:
    "commerce electronique, acheter de l'electronique, l'electronique pas cher",
};

export default Meta;
