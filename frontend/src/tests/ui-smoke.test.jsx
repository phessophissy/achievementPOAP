import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';

describe('UI smoke tests', () => {
  it('renders button styles and handles clicks', () => {
    const onClick = vi.fn();
    render(
      <Button variant="secondary" size="small" onClick={onClick}>
        Click Me
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Click Me' });
    expect(button).toHaveClass('btn');
    expect(button).toHaveClass('btn-secondary');
    expect(button).toHaveClass('btn-small');

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders and closes modal from close button and overlay click', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal isOpen onClose={onClose} title="Smoke Modal">
        <p>Body</p>
      </Modal>
    );

    expect(screen.getByText('Smoke Modal')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '×' }));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(container.querySelector('.modal-overlay'));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
