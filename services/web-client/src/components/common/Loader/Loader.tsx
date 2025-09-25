"use client"
import clsx from 'clsx';
import styles from './Loader.module.scss';

export enum LoaderSizes {
    small = 'small',
    large = 'large',
}

interface IProps {
    size?: LoaderSizes,
}

export const Loader = ({
    size = LoaderSizes.small,
}: IProps) => {
    return <div className={clsx(styles.loader, styles[size])} />
};
