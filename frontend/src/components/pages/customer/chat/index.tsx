"use client";

import { MoreVerticalIcon, PlusCircleIcon, SendIcon } from "lucide-react";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Message, MessageContent, MessageFooter, MessageGroup } from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { conversations, getProductById } from "@/lib/mock/chatcommerce";

export default function CustomerChatPage() {
  const conversation = conversations[0];
  const product = conversation.productId ? getProductById(conversation.productId) : undefined;

  return (
    <main className="grid flex-1 overflow-hidden md:grid-cols-[320px_1fr]">
      <aside className="hidden border-r bg-card md:block">
        <div className="flex h-20 items-center justify-between border-b px-5">
          <h1 className="text-2xl font-bold">Messages</h1>
          <Button variant="ghost" size="icon-sm" aria-label="New message">
            <PlusCircleIcon />
          </Button>
        </div>
        <button className="flex w-full gap-4 border-l-4 border-primary bg-primary/10 p-5 text-left" type="button">
          <Avatar className="size-12">
            <AvatarImage src="/window.svg" />
            <AvatarFallback>DV</AvatarFallback>
          </Avatar>
          <span className="min-w-0 flex-1">
            <span className="flex justify-between gap-4 font-semibold">
              DplugVIP Business <span className="text-sm font-normal text-muted-foreground">Now</span>
            </span>
            <span className="block truncate text-muted-foreground">Yes, the M3 Max is in stock.</span>
          </span>
        </button>
      </aside>
      <section className="flex min-h-0 flex-col">
        <header className="flex h-20 items-center gap-4 border-b px-4 md:px-6">
          <Avatar className="size-12">
            <AvatarImage src="/window.svg" />
            <AvatarFallback>DV</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-2xl font-bold">DplugVIP Business</h2>
            <p className="text-sm text-muted-foreground">
              <span className="mr-2 inline-block size-2 rounded-full bg-secondary" />
              Typically replies in 5 minutes
            </p>
          </div>
          <Button variant="ghost" size="icon-sm" aria-label="Conversation options">
            <MoreVerticalIcon />
          </Button>
        </header>
        <MessageScrollerProvider>
          <MessageScroller className="flex-1 bg-muted/30">
            <MessageScrollerViewport>
              <MessageScrollerContent className="gap-7 px-4 py-8 md:px-10">
                <MessageScrollerItem className="flex justify-center">
                  <div className="rounded-full bg-background px-4 py-1 text-sm text-muted-foreground">Today</div>
                </MessageScrollerItem>
                {product ? (
                  <MessageScrollerItem>
                    <div className="mx-auto flex w-full max-w-xl gap-4 rounded-xl border bg-card p-3 shadow-sm">
                      <span className="relative size-20 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={product.images[0].src}
                          alt={product.images[0].alt}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground">Viewing Product</p>
                        <p className="truncate font-semibold">{product.title}</p>
                        <p className="font-bold text-primary">${product.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </MessageScrollerItem>
                ) : null}
                <MessageGroup>
                  {conversation.messages.map((message) => {
                    const fromCustomer = message.sender === "customer";

                    return (
                      <MessageScrollerItem key={message.id} scrollAnchor={message.id === conversation.messages.at(-1)?.id}>
                        <Message align={fromCustomer ? "end" : "start"}>
                          <MessageContent>
                            <Bubble align={fromCustomer ? "end" : "start"} variant={fromCustomer ? "tinted" : "default"}>
                              <BubbleContent>{message.body}</BubbleContent>
                            </Bubble>
                            <MessageFooter>{message.timestamp}</MessageFooter>
                          </MessageContent>
                        </Message>
                      </MessageScrollerItem>
                    );
                  })}
                </MessageGroup>
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
        <footer className="border-t bg-background p-4 md:p-6">
          <InputGroup className="h-14 rounded-full bg-muted">
            <InputGroupAddon>
              <PlusCircleIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Type a message..." />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-sm" className="rounded-full" aria-label="Send message">
                <SendIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <p className="mt-3 text-center text-xs uppercase tracking-normal text-muted-foreground">End-to-end encrypted</p>
        </footer>
      </section>
    </main>
  );
}
