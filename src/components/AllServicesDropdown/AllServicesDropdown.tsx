import React, { useEffect, useRef, useState } from 'react';
import { Backdrop, Bullseye, MenuToggle, Panel, PanelMain, Popper, Spinner } from '@patternfly/react-core';

import './AllServicesDropdown.scss';
import AllServicesPortal from './AllServicesMenu';
import { useLocation } from 'react-router-dom';
import useAllServices from '../../hooks/useAllServices';
import useFavoritedServices from '../../hooks/useFavoritedServices';

export type ServicesNewNavProps = {
  Footer?: React.ReactNode;
};

const AllServicesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const { linkSections, ready } = useAllServices();
  const favoritedServices = useFavoritedServices();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleMenuKeys = (event: KeyboardEvent) => {
    if (!isOpen) {
      return;
    }
    if (menuRef.current?.contains(event.target as Node) || toggleRef.current?.contains(event.target as Node)) {
      if (event.key === 'Escape' || event.key === 'Tab') {
        setIsOpen((prev) => !prev);
        toggleRef.current?.focus();
      }
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (isOpen && !menuRef.current?.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleMenuKeys);
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleMenuKeys);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, menuRef]);

  const onToggleClick = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    setIsOpen(!isOpen);
  };

  const toggle = (
    <MenuToggle className="pf-m-full-height chr-c-link-service-toggle" ref={toggleRef} onClick={onToggleClick} isExpanded={isOpen}>
      Services
    </MenuToggle>
  );

  return (
    <Popper
      trigger={toggle}
      appendTo={document.body}
      isVisible={isOpen}
      popper={
        ready ? (
          <AllServicesPortal
            favoritedServices={favoritedServices}
            linkSections={linkSections}
            menuRef={menuRef}
            setIsOpen={setIsOpen}
            isOpen={isOpen}
          />
        ) : (
          <div ref={menuRef} className="pf-c-dropdown chr-c-page__services-nav-dropdown-menu" data-testid="chr-c__find-app-service">
            <Backdrop>
              <Panel variant="raised" className="pf-c-dropdown__menu pf-u-p-0 pf-u-w-100 chr-c-panel-services-nav ">
                <PanelMain>
                  <Bullseye>
                    <Spinner />
                  </Bullseye>
                </PanelMain>
              </Panel>
            </Backdrop>
          </div>
        )
      }
    />
  );
};

export default AllServicesDropdown;
