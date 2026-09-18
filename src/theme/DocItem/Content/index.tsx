import React, {useEffect} from 'react';
import type {ReactNode} from 'react';
import {useLocation} from '@docusaurus/router';
import type {WrapperProps} from '@docusaurus/types';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import mediumZoom from 'medium-zoom';

type Props = WrapperProps<typeof ContentType>;

export default function DocItemContent(props: Props): ReactNode {
	const {pathname} = useLocation();

	useEffect(() => {
		const zoom = mediumZoom('.markdown img');
		return () => {
			zoom.detach();
		};
	}, [pathname]);

	return <Content {...props} />;
}
