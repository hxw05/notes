import React from 'react';
import type {ReactNode} from 'react';
import Types from '@theme-original/Admonition/Types';
import styles from './details.module.css';

type Props = {
	type: string;
	title?: ReactNode;
	icon?: ReactNode;
	children: ReactNode;
	className?: string;
	id?: string;
};

function AdmonitionTypeDetails({title, children, className, id}: Props): ReactNode {
	return (
		<details className={[styles.details, className].filter(Boolean).join(' ')} id={id}>
			<summary className={styles.summary}>{title ?? 'details'}</summary>
			<div className={styles.content}>{children}</div>
		</details>
	);
}

export default {
	...Types,
	details: AdmonitionTypeDetails,
};
