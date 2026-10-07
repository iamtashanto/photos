import { PhotographsPage } from "../../pages/photographs-page";

export default async function EditPhotographRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PhotographsPage editSlug={slug} />;
}
