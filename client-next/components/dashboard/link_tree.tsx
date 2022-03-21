import LinkTreeItem from "./link_tree_item";

interface Link {
  id: string,
  uri: string,
  title: string,
  description: string,
  image_uri?: string,
}

interface Props {
  links: Array<Link>;
}

const LinkTree = ({ links }: Props) => {
  console.log("LinkTree", links)
  return (
    <div>
      <div className="space-y-4 w-full">
        {links.map((link: Link) => <LinkTreeItem key={link.id} link={link} />)}
      </div>
    </div>
  )
}

export default LinkTree;