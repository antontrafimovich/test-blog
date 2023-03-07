import Head from "next/head";

import { getAllPostIds, getPostData } from "../lib/posts";
import Date from "../shared/components/date/date";
import Layout from "../shared/components/layout/layout";
import utilStyles from "../shared/styles/utils.module.css";

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.dataHTML }} />
      </article>
    </Layout>
  );
}

export const getStaticPaths = async () => {
  const paths = await getAllPostIds();

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const postData = await getPostData(`${params.id}.md`);

  return {
    props: {
      postData,
    },
  };
};
