import React, { useCallback, useState } from 'react';
// Tiptap packages
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Link from '@tiptap/extension-link';
import Bold from '@tiptap/extension-bold';
import Underline from '@tiptap/extension-underline';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Code from '@tiptap/extension-code';
import History from '@tiptap/extension-history';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
// Custom

import * as Icons from './Icons';
import { LinkModal } from './LinkModal';
import './RichTextEditor.css';

const RichTextEditor = ({ noteContent, onChangeContent }) => {
  const content = `<p>Start typing ... </p>`;

  const editor = useEditor({
    extensions: [
      Document,
      History,
      Paragraph,
      Text,
      Link.configure({
        openOnClick: false,
      }),
      Bold,
      Underline,
      Italic,
      Strike,
      Code,
      BulletList,
      OrderedList,
      ListItem,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: noteContent, // Use the noteContent prop as initial content
    onUpdate: ({ editor }) => {
      if (onChangeContent) {
        onChangeContent(editor.getHTML());
      }
    },
  });

  const [modalIsOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');

  const openModal = useCallback(() => {
    setUrl(editor.getAttributes('link').href);
    setIsOpen(true);
  }, [editor]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setUrl('');
  }, []);

  const saveLink = useCallback(() => {
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url, target: '_blank' })
        .run();
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    closeModal();
  }, [editor, url, closeModal]);

  const removeLink = useCallback(() => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    closeModal();
  }, [editor, closeModal]);

  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className='editor'>
      <div className='menu'>
        <button
          type='button'
          className={`menu-button is-active ${editor.isActive('link')}`}
          onClick={openModal}
        >
          <Icons.Link />
        </button>
        <button
          type='button'
          className={`menu-button is-active ${editor.isActive('bold')}`}
          onClick={toggleBold}
        >
          <Icons.Bold />
        </button>
        <button
          type='button'
          className={`menu-button is-active ${editor.isActive('underline')}`}
          onClick={toggleUnderline}
        >
          <Icons.Underline />
        </button>
        <button
          type='button'
          className={`menu-button is-active ${editor.isActive('italic')}`}
          onClick={toggleItalic}
        >
          <Icons.Italic />
        </button>
        <button
          type='button'
          className={`menu-button is-active ${editor.isActive('strike')}`}
          onClick={toggleStrike}
        >
          <Icons.Strikethrough />
        </button>

        <button
          type='button'
          className={`menu-button ${
            editor.isActive('bulletList') ? 'is-active' : ''
          }`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <Icons.BulletList />
        </button>
        <button
          type='button'
          className={`menu-button ${
            editor.isActive('orderedList') ? 'is-active' : ''
          }`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <Icons.OrderedList />
        </button>
        <button
          type='button'
          className={`menu-button ${
            editor.isActive('taskList') ? 'is-active' : ''
          }`}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <Icons.Checkbox />
        </button>
      </div>

      <BubbleMenu
        className='bubble-menu-light'
        tippyOptions={{ duration: 150 }}
        editor={editor}
        shouldShow={({ editor, view, state, oldState, from, to }) => {
          // only show the bubble menu for links.
          return from === to && editor.isActive('link');
        }}
      >
        <button className='button' onClick={openModal}>
          Edit
        </button>
        <button className='button-remove' onClick={removeLink}>
          Remove
        </button>
      </BubbleMenu>

      <EditorContent editor={editor} />

      <LinkModal
        url={url}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Edit Link Modal'
        closeModal={closeModal}
        onChangeUrl={(e) => setUrl(e.target.value)}
        onSaveLink={saveLink}
        onRemoveLink={removeLink}
      />
    </div>
  );
};

export default RichTextEditor;
